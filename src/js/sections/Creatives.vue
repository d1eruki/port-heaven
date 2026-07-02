<template>
  <section
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh lg:py-[50dvh]"
  >
    <div
      class="scroll-speed-05 pointer-events-none left-0 flex w-fit flex-col gap-5 justify-self-center bg-inverse p-15 text-inverse-fg lg:sticky lg:top-[50%] lg:-translate-y-1/2 lg:items-center lg:bg-transparent lg:p-0 lg:text-fg"
    >
      <h2>{{ t("menu.creatives.title") }}</h2>
      <MenuDesc
        class="lg:max-w-[23dvw]"
        :menu-desc="t('menu.creatives.description')"
      />
    </div>
    <div class="container-creatives h-fit w-full lg:mb-[35dvh] lg:grid lg:grid-cols-20 lg:p-10">
      <component
        :is="creative.type === 'video' ? VideoCreative : ImgCreative"
        v-for="creative in creatives"
        :key="creative.src"
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
import ImgCreative from "../vue-components/img-creatives.vue";
import MenuDesc from "../vue-components/menu-description.vue";
import VideoCreative from "../vue-components/video-creatives.vue";

const { t } = useI18n();
</script>
