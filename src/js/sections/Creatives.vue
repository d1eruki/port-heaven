<template>
  <section
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh lg:h-[var(--creative-stream-height)]"
    :style="creativeSectionStyle"
  >
    <div
      data-creatives-heading-pin
      class="contents lg:pointer-events-none lg:relative lg:z-20 lg:grid lg:h-dvh lg:w-full lg:place-items-center"
    >
      <div
        class="pointer-events-none left-0 mx-10 mb-10 flex w-auto flex-col gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:m-0 lg:w-fit lg:items-center lg:rounded-none lg:bg-transparent lg:p-0 lg:text-primary"
      >
        <h2>{{ t("menu.creatives.title") }}</h2>
        <MenuDescription
          class="lg:max-w-[23dvw]"
          :menu-desc="t('menu.creatives.description')"
        />
        <Button
          v-if="devModeEnabled"
          size="compact"
          class="pointer-events-auto"
          @click="shuffleCreatives"
        >
          {{ t("buttons.shuffleCreatives") }}
        </Button>
      </div>
    </div>
    <div
      data-creative-cloud
      aria-label="Creative work gallery"
      class="w-full columns-2 gap-3 px-10 pb-10 sm:columns-3 sm:gap-5 lg:absolute lg:inset-0 lg:block lg:columns-auto lg:overflow-clip lg:p-0"
    >
      <div
        v-for="creative in creativeCloud"
        :key="creative.src"
        data-creative-cloud-item
        :data-depth="creative.depth"
        :data-drift-x="creative.driftX"
        :data-drift-y="creative.driftY"
        class="relative mb-3 inline-block w-full break-inside-avoid hover:z-100! sm:mb-5 lg:absolute lg:top-[var(--creative-top)] lg:left-[var(--creative-left)] lg:z-[var(--creative-z-index)] lg:mb-0 lg:block lg:w-[var(--creative-width)] lg:rotate-[var(--creative-rotation)] lg:will-change-transform"
        :style="creative.style"
      >
        <VideoCreative
          v-if="creative.type === 'video'"
          :creative-src="creative.src"
        />
        <ImageCreative
          v-else
          :creative-alt="creative.alt"
          :creative-src="creative.src"
          :image-height="creative.height"
          :image-width="creative.width"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "../components/Button.vue";
import { createCreatives } from "../data/creatives";
import ImageCreative from "../components/ImageCreative.vue";
import MenuDescription from "../components/MenuDescription.vue";
import VideoCreative from "../components/VideoCreative.vue";
import { devModeEnabled } from "../features/preferences/dev-mode";
import { ScrollTrigger } from "../libraries/gsap-scroll";
import { createCreativeCloudItem, getCreativeCloudHeight } from "../utils/creative-cloud-layout";

const { t } = useI18n();
const { width: viewportWidth, height: viewportHeight } = useWindowSize();
const layoutSeed = ref(0);
const creativeCloud = computed(() =>
  createCreatives(layoutSeed.value).map((creative, index) =>
    createCreativeCloudItem(creative, index, layoutSeed.value),
  ),
);
const creativeSectionStyle = computed(() => ({
  "--creative-stream-height": `${getCreativeCloudHeight(
    creativeCloud.value,
    viewportWidth.value / Math.max(viewportHeight.value, 1),
  )}dvh`,
}));

const shuffleCreatives = async () => {
  layoutSeed.value += 1;
  await nextTick();
  ScrollTrigger.refresh();
};
</script>
