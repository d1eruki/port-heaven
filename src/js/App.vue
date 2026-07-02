<template>
  <Hero />

  <div
    id="menu-dot"
    class="fixed top-0 left-0 z-50 flex min-h-svh w-15 items-center justify-center text-blend transition-opacity duration-300 ease-in-out lg:pointer-events-none lg:opacity-0 hw:mix-blend-difference"
  >
    <nav class="flex w-fit flex-col gap-5"></nav>
  </div>

  <div
    id="progress-bar"
    class="progress-bar fixed top-0 right-0 z-100 hidden bg-blend mix-blend-difference lg:flex"
  ></div>

  <div
    id="menu-right"
    class="fixed top-5 right-5 z-200 flex justify-end gap-5 text-blend mix-blend-difference lg:top-15 lg:right-15"
  >
    <button
      id="theme-toggle"
      type="button"
      aria-label="Toggle theme"
      class="group flex"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small
      ><small data-theme-toggle-label>{{ t("theme-toggle.light") }}</small>
    </button>

    <button
      id="lang-toggle"
      type="button"
      aria-label="Toggle lang"
      class="group flex"
    >
      <small class="opacity-0 group-hover:opacity-100">/</small
      ><small>{{ t("lang-toggle") }}</small>
    </button>
  </div>

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

  <button
    id="scroll-to-top"
    type="button"
    class="group fixed right-5 bottom-5 z-200 flex text-blend mix-blend-difference lg:right-15 lg:bottom-15"
  >
    <small class="opacity-0 group-hover:opacity-100">/</small
    ><small>{{ t("buttons.toTop") }}</small>
  </button>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Hero from "./sections/Hero.vue";
import Description from "./sections/Description.vue";
import About from "./sections/About.vue";
import Projects from "./sections/Projects.vue";
import Design from "./sections/Design.vue";
import Creatives from "./sections/Creatives.vue";
import Footer from "./sections/Footer.vue";

const { t } = useI18n();
</script>
