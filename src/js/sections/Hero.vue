<template>
  <section
    data-section="hero"
    id="hero"
    class="hero min-h-svh bg-scroll lg:bg-fixed"
  >
    <div class="relative isolate flex min-h-svh w-full overflow-x-hidden">
      <img
        :src="heroImageSrc"
        class="hero-image scroll-speed-50 lg:top-50% absolute right-0 left-0 z-1 h-svh w-auto justify-self-center object-cover grayscale transition-opacity duration-300 lg:right-30 lg:z-3 lg:h-9/10 lg:self-center lg:justify-self-end"
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
        viewBox="0 0 756 1031"
        class="hero-image scroll-speed-50 lg:top-50% absolute right-0 left-0 z-1 hidden h-svh w-auto justify-self-center fill-primary object-cover lg:right-30 lg:block lg:h-9/10 lg:self-center lg:justify-self-end"
        data-parallax-anchor="top"
        data-parallax-scale="0.0001"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M240.057 1001.8L221.878 951.318L175.502 921.253L95.7353 870.032L45.6493 779.466L28.583 719.707L0.386414 677.022L11.1456 597.963L45.6493 513.336L70.8778 470.28L108.35 439.473H142.111L194.794 428.338L179.583 377.116L142.111 363.012L153.612 316.986L142.111 278.385L170.679 255.743L179.583 166.662L210.006 94.2837L231.895 48.2585L285.32 10.3991L383.637 0.377441L495.31 38.9792L543.17 82.7774L586.578 159.239V242.01L575.077 305.109L607.725 316.986L586.578 387.509L555.413 439.473L543.17 462.114L607.725 485.498L703.074 526.698L733.497 592.024L755.386 687.044L743.514 755.711L716.802 808.788L669.684 846.277L663.748 884.136L632.954 906.035L607.725 889.332L576.561 916.799L543.17 930.532H508.667L497.536 957.999L467.485 985.837L432.239 1008.48L407.011 991.776L386.234 971.361L338.374 1001.8L303.128 1030.38L240.057 1001.8Z"
        />
      </svg>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import somaLancetImage from "../../assets/soma-lancet.webp";
import somaLancetHoverImage from "../../assets/soma-lancet-2.webp";

const { t } = useI18n();
const isHeroHovered = ref(false);
const heroImageSrc = computed(() =>
  isHeroHovered.value ? somaLancetHoverImage : somaLancetImage,
);
</script>
