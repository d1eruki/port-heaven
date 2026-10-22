<!-- Первый экран с именем автора и изображением персонажа. -->
<template>
  <section
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
      <img
        :src="heroImageSrc"
        class="relative z-2 h-[86svh] w-full self-center object-cover transition-opacity duration-300 sm:h-[90svh] sm:w-auto sm:max-w-none sm:object-contain lg:h-[94svh]"
        data-hero-parallax
        data-speed="0.5"
        alt=""
        fetchpriority="high"
        decoding="sync"
        loading="eager"
        @pointerenter="onHeroPointerEnter"
        @pointerleave="isHeroHovered = false"
        @click="toggleHeroImage"
      />
    </div>
  </section>
</template>

<script setup>
import fitty from "fitty";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getBreakpointPx } from "../utils/breakpoints";
import heroCharacterDarkImage from "../../assets/hero-character-dark.png";
import heroCharacterDarkHoverImage from "../../assets/hero-character-dark-hover.png";
import heroCharacterLightImage from "../../assets/hero-character-light.png";
import heroCharacterLightHoverImage from "../../assets/hero-character-light-hover.png";

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
const heroTitleRef = ref(null);
let heroTitleFit;
let mobileMedia;

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
  mobileMedia?.removeEventListener("change", syncHeroTitleFit);
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;
});

const heroImageSrc = computed(() => {
  const showTongue = isMobile.value ? isHeroTapped.value : isHeroHovered.value;

  if (props.currentTheme === "dark") {
    return showTongue ? heroCharacterDarkHoverImage : heroCharacterDarkImage;
  }

  return showTongue ? heroCharacterLightHoverImage : heroCharacterLightImage;
});
</script>
