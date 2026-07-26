<template>
  <section
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh lg:py-[50dvh]"
  >
    <div
      data-parallax-desktop-only
      class="scroll-speed-05 pointer-events-none left-0 mx-10 mb-10 flex w-auto flex-col gap-5 rounded-4xl bg-inverse p-5 text-inverse-fg lg:sticky lg:top-[50%] lg:m-0 lg:w-fit lg:-translate-y-1/2 lg:items-center lg:justify-self-center lg:rounded-none lg:bg-transparent lg:p-0 lg:text-fg"
    >
      <h2>{{ t("menu.creatives.title") }}</h2>
      <MenuDescription
        class="lg:max-w-[23dvw]"
        :menu-desc="t('menu.creatives.description')"
      />
    </div>
    <div
      class="container-creatives flex h-fit w-full flex-col gap-5 px-10 pb-10 lg:mb-[35dvh] lg:grid lg:grid-cols-20 lg:gap-0 lg:p-10"
    >
      <component
        :is="creative.type === 'video' ? VideoCreative : ImageCreative"
        v-for="creative in creatives"
        :key="creative.src"
        :creative-alt="creative.alt"
        :creative-src="creative.src"
        :col="creative.col"
        :col-span="creative.colSpan"
        :row="creative.row"
        :row-span="creative.rowSpan"
      />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { creatives } from "../data/creatives";
import ImageCreative from "../components/ImageCreative.vue";
import MenuDescription from "../components/MenuDescription.vue";
import VideoCreative from "../components/VideoCreative.vue";

const { t } = useI18n();
</script>
