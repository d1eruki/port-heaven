<template>
  <section
    data-section="hero"
    id="hero"
    class="min-h-svh w-full min-w-0 overflow-hidden bg-canvas"
  >
    <div
      class="relative isolate flex min-h-svh w-full min-w-0 items-end justify-center overflow-hidden bg-canvas"
    >
      <div class="absolute inset-0 z-1 flex items-center justify-center overflow-hidden text-fg">
        <h1 class="text-center text-hero-title leading-[0.75] whitespace-pre-line">
          {{ t("brand.hero") }}
        </h1>
      </div>
      <img
        :src="heroImageSrc"
        class="scroll-speed-50 relative z-2 h-[86svh] w-full self-center object-cover transition-opacity duration-300 sm:h-[90svh] sm:w-auto sm:max-w-none sm:object-contain lg:h-[94svh]"
        data-parallax-anchor="top"
        data-parallax-scale="0.0001"
        alt=""
        fetchpriority="high"
        decoding="sync"
        loading="eager"
        @mouseover="isHeroHovered = true"
        @mouseout="isHeroHovered = false"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
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
const heroImageSrc = computed(() => {
  if (props.currentTheme === "dark") {
    return isHeroHovered.value ? heroCharacterDarkHoverImage : heroCharacterDarkImage;
  }

  return isHeroHovered.value ? heroCharacterLightHoverImage : heroCharacterLightImage;
});
</script>
