<template>
  <section
    data-section="hero"
    id="hero"
    class="hero min-h-svh bg-scroll lg:bg-fixed"
  >
    <div class="relative isolate flex min-h-svh w-full overflow-x-hidden">
      <img
        :src="heroImageSrc"
        class="hero-image scroll-speed-50 absolute right-0 left-0 z-1 h-svh w-auto justify-self-center object-cover grayscale transition-opacity duration-300 lg:right-30 lg:z-3 lg:h-9/10 lg:self-center lg:justify-self-end"
        data-parallax-anchor="top"
        data-parallax-scale="0.0001"
        alt=""
        fetchpriority="high"
        decoding="sync"
        loading="eager"
        @mouseover="isHeroHovered = true"
        @mouseout="isHeroHovered = false"
      />
      <div
        class="z-2 flex w-full flex-col content-end justify-end gap-10 p-15 text-blend lg:flex-row lg:items-end lg:justify-between lg:mix-blend-difference"
      >
        <h1 class="whitespace-pre-line text-fg">{{ t("brand.hero") }}</h1>
        <small class="hidden lg:block">{{ t("brand.logo") }}</small>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="svgShapes.heroLancet.viewBox"
        class="hero-image scroll-speed-50 absolute right-0 left-0 z-1 hidden h-svh w-auto justify-self-center fill-accent object-cover lg:right-30 lg:block lg:h-9/10 lg:self-center lg:justify-self-end"
        data-parallax-anchor="top"
        data-parallax-scale="0.0001"
        aria-hidden="true"
        focusable="false"
      >
        <path :d="svgShapes.heroLancet.path" />
      </svg>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import somaLancetImage from "../../assets/soma-lancet.webp";
import somaLancetHoverImage from "../../assets/soma-lancet-2.webp";
import { svgShapes } from "../data/svg-shapes";

const { t } = useI18n();
const isHeroHovered = ref(false);
const heroImageSrc = computed(() => (isHeroHovered.value ? somaLancetHoverImage : somaLancetImage));
</script>
