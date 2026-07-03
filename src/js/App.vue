<template>
  <Hero />
  <AppControls />

  <Description />

  <header
    class="sticky top-0 z-100 flex h-fit min-h-10 w-full bg-accent-section px-15 py-5 text-accent-section-fg hw:hidden"
  >
    {{ t("notices.hardwareAccelerationDisabled") }}
  </header>

  <About />
  <Projects />
  <Design />
  <Creatives />
  <Footer />
</template>

<script setup>
import { useI18n } from "vue-i18n";
import AppControls from "./components/AppControls.vue";
import Hero from "./sections/Hero.vue";
import Description from "./sections/Description.vue";
import About from "./sections/About.vue";
import Projects from "./sections/Projects.vue";
import Design from "./sections/Design.vue";
import Creatives from "./sections/Creatives.vue";
import Footer from "./sections/Footer.vue";

const { t } = useI18n();
</script>
