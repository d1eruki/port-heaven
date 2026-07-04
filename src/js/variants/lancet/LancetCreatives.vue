<template>
  <section
    data-section="creatives"
    id="creatives"
    class="relative block min-h-dvh lg:ml-50 lg:grid lg:auto-cols-fr lg:auto-rows-fr lg:grid-cols-20 lg:gap-0"
  >
    <div
      class="pointer-events-none sticky z-10 flex h-fit flex-col gap-5 p-10 lg:top-1/2 lg:left-1/2 lg:w-150 lg:-translate-x-1/2 lg:-translate-y-1/2"
    >
      <h2 class="glow-lg w-full">{{ t("menu.creatives.title") }}</h2>
      <p>{{ t("menu.creatives.description") }}</p>
    </div>
    <div
      v-for="creative in creatives"
      :key="creative.src"
      class="card-rotate h-fit"
      :style="getCreativeGridStyle(creative)"
    >
      <img
        v-if="creative.type === 'image'"
        class="card-rotate-face backface-hidden"
        :src="creative.src"
        :alt="creative.alt"
        loading="lazy"
        decoding="async"
      />
      <video
        v-else
        class="card-rotate-face backface-hidden"
        :src="creative.src"
        muted
        controls
        autoplay
        loop
        preload="none"
        playsinline
      ></video>
      <div
        class="card-rotate-shirt absolute top-0 h-full w-full backface-hidden light:bg-(--color-black)"
      >
        <fieldset class="absolute top-0 w-full">
          <legend>вредина</legend>
        </fieldset>
        <fieldset class="absolute top-[100%] w-full origin-top-right rotate-90">
          <legend>негодяй</legend>
        </fieldset>
        <fieldset class="absolute bottom-0 w-full rotate-180">
          <legend>злюка</legend>
        </fieldset>
        <fieldset class="absolute top-[100%] w-full origin-top-left -rotate-90">
          <legend>лиходей</legend>
        </fieldset>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { creatives } from "../../data/creatives";
import { getCreativeGridStyle } from "../../utils/creative-grid-style";

const { t } = useI18n();
</script>
