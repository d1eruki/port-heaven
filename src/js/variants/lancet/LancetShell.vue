<template>
  <div
    class="lancet-shell relative container grid max-w-full gap-10 leading-none text-balance break-normal wrap-break-word hyphens-auto whitespace-pre-line lg:gap-20"
  >
    <LancetHero />
    <LancetNav />
    <div
      id="progress-bar"
      class="progress-bar fixed top-0 right-0 bg-progress"
    ></div>
    <LancetAbout />
    <LancetProjects />
    <LancetDesign />
    <LancetCreatives />
    <LancetFooter />
    <div
      class="grain -z-1"
      aria-hidden="true"
    ></div>
    <img
      alt=""
      aria-hidden="true"
      class="lancet-soma scroll-speed---8 pointer-events-none fixed right-[5%] bottom-0 -z-1 md:h-[85%]"
      data-parallax-anchor="top"
      :src="somaImage"
    />
  </div>
</template>

<script setup>
import LancetHero from "./LancetHero.vue";
import LancetNav from "./LancetNav.vue";
import LancetAbout from "./LancetAbout.vue";
import LancetProjects from "./LancetProjects.vue";
import LancetDesign from "./LancetDesign.vue";
import LancetCreatives from "./LancetCreatives.vue";
import LancetFooter from "./LancetFooter.vue";
import somaImage from "../../../assets/images/soma.png";
</script>
