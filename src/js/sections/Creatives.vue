<template>
  <section
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh"
  >
    <div
      data-creatives-heading-pin
      class="contents lg:grid lg:h-dvh lg:w-full lg:place-items-center"
    >
      <div
        class="pointer-events-none left-0 mx-10 mb-10 flex w-auto flex-col gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:m-0 lg:w-fit lg:items-center lg:rounded-none lg:bg-transparent lg:p-0 lg:text-primary"
      >
        <h2>{{ t("menu.creatives.title") }}</h2>
        <MenuDescription
          class="lg:max-w-[23dvw]"
          :menu-desc="t('menu.creatives.description')"
        />
      </div>
    </div>
    <div
      class="container-creatives flex h-fit w-full flex-col gap-5 px-10 pb-10 lg:grid lg:grid-cols-20 lg:gap-0 lg:p-10"
    >
      <component
        :is="creative.type === 'video' ? VideoCreative : ImageCreative"
        v-for="creative in creatives"
        :key="creative.src"
        :creative-alt="creative.alt"
        :creative-src="creative.src"
        :image-height="creative.height"
        :image-width="creative.width"
        :col="creative.col"
        :col-span="creative.colSpan"
        :row="creative.row"
        :row-span="creative.rowSpan"
      />
    </div>
    <div
      aria-hidden="true"
      class="hidden lg:block lg:h-dvh"
    ></div>
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
