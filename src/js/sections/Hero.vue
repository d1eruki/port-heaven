<template>
  <section
    data-section="hero"
    id="hero"
    class="min-h-svh w-full min-w-0 overflow-hidden bg-canvas"
  >
    <div
      class="relative isolate flex min-h-svh w-full min-w-0 items-end justify-center overflow-hidden bg-canvas"
    >
      <div
        class="absolute inset-0 z-1 flex items-center justify-center overflow-hidden text-fg"
      >
        <h1 class="text-center text-[clamp(4.5rem,15vw,24rem)] leading-[0.75] whitespace-pre-line">
          {{ t("brand.hero") }}
        </h1>
      </div>
      <img
        :src="heroImageSrc"
        class="scroll-speed-50 relative z-2 h-[86svh] w-full object-cover transition-opacity duration-300 sm:h-[90svh] sm:w-auto sm:max-w-none sm:object-contain lg:h-[94svh]"
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
import heroCharacterImage from "../../assets/hero-character.png";
import heroCharacterHoverImage from "../../assets/hero-character-hover.png";

const { t } = useI18n();
const isHeroHovered = ref(false);
const heroImageSrc = computed(() =>
  isHeroHovered.value ? heroCharacterHoverImage : heroCharacterImage,
);
</script>
