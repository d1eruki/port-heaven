<!-- Креативы с сохраняемой раскладкой и раскрытием галереи по высоте на мобильных экранах. -->
<template>
  <section
    ref="creativeSectionRef"
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh max-lg:flex max-lg:flex-col max-lg:gap-content max-lg:px-section max-lg:pt-section-gap lg:h-[var(--creative-stream-height)]"
    :style="creativeSectionStyle"
  >
    <div
      data-creatives-heading-pin
      class="contents lg:pointer-events-none lg:relative lg:z-20 lg:grid lg:h-dvh lg:w-full lg:place-items-center lg:p-section"
    >
      <div
        class="pointer-events-none left-0 flex w-auto flex-col gap-related rounded-4xl bg-inverse p-panel text-on-inverse lg:w-fit lg:items-center lg:rounded-none lg:bg-transparent lg:p-0 lg:text-primary"
      >
        <div class="grid max-w-full gap-related lg:w-fit lg:self-center">
          <h2 class="text-left lg:text-center">{{ t("menu.creatives.title") }}</h2>
          <MenuDescription
            class="lg:justify-self-center lg:text-center lg:[contain:inline-size]"
            :menu-desc="t('menu.creatives.description')"
          />
        </div>
        <Button
          v-if="devModeEnabled"
          size="compact"
          class="pointer-events-auto"
          :disabled="isSavingLayout"
          :aria-busy="isSavingLayout"
          @click="shuffleCreatives"
        >
          {{ t("buttons.shuffleCreatives") }}
        </Button>
        <p
          v-if="saveError"
          role="alert"
        >
          {{ saveError }}
        </p>
      </div>
    </div>
    <div
      id="creative-gallery"
      ref="creativeGalleryRef"
      data-creative-cloud
      aria-label="Creative work gallery"
      class="w-full overflow-clip max-lg:max-h-[var(--creative-reveal-height)] max-lg:rounded-4xl lg:absolute lg:inset-0 lg:block"
    >
      <div
        ref="creativeGalleryContentRef"
        class="w-full columns-2 gap-0 sm:columns-3 lg:contents"
      >
        <div
          v-for="creative in creativeCloud"
          :key="creative.src"
          data-creative-cloud-item
          :data-depth="creative.depth"
          :data-drift-x="creative.driftX"
          :data-drift-y="creative.driftY"
          class="relative block w-full break-inside-avoid hover:z-100! lg:absolute lg:top-[var(--creative-top)] lg:left-[var(--creative-left)] lg:z-[var(--creative-z-index)] lg:w-[var(--creative-width)] lg:rotate-[var(--creative-rotation)] lg:will-change-transform"
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
            :image-sources="creative.sources"
            :image-sizes="`(min-width: 1024px) min(${creative.layoutWidth}vw, ${creative.layoutWidth / 100 * contentMaxWidth}px), (min-width: 640px) calc((100vw - 5rem) / 3), calc((100vw - 5rem) / 2)`"
            :image-height="creative.height"
            :image-width="creative.width"
          />
        </div>
      </div>
    </div>
    <Button
      v-if="hasMoreCreatives"
      class="self-center lg:hidden"
      aria-controls="creative-gallery"
      @click="showMoreCreatives"
    >
      {{ t("buttons.showMore") }}
    </Button>
  </section>
</template>

<script setup>
import { useElementSize, useMediaQuery, useWindowSize } from "@vueuse/core";
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "../components/Button.vue";
import { createCreatives } from "../data/creatives";
import savedLayout from "../data/creative-layout.json";
import ImageCreative from "../components/ImageCreative.vue";
import MenuDescription from "../components/MenuDescription.vue";
import VideoCreative from "../components/VideoCreative.vue";
import { devModeEnabled } from "../features/preferences/dev-mode";
import { ScrollTrigger } from "../libraries/gsap-scroll";
import { createCreativeCloudItem, getCreativeCloudHeight } from "../utils/creative-cloud-layout";
import { getBreakpointPx } from "../utils/breakpoints";

const { t } = useI18n();
const creativeSectionRef = ref(null);
const { width: contentWidth } = useElementSize(creativeSectionRef);
const { height: viewportHeight } = useWindowSize();
const contentMaxWidth = getBreakpointPx("3xl");
const isMobileGallery = useMediaQuery(`(width < ${getBreakpointPx("lg")}px)`);
const creativeGalleryRef = ref(null);
const creativeGalleryContentRef = ref(null);
const { height: galleryHeight } = useElementSize(creativeGalleryRef);
const { height: galleryContentHeight } = useElementSize(creativeGalleryContentRef);
const revealedGalleryHeight = ref(0);
const layoutSeed = ref(savedLayout.seed);
const isSavingLayout = ref(false);
const saveError = ref("");
const creativeCloud = computed(() =>
  createCreatives(layoutSeed.value).map((creative, index) =>
    createCreativeCloudItem(creative, index, layoutSeed.value),
  ),
);
const hasMoreCreatives = computed(
  () => isMobileGallery.value && galleryContentHeight.value > galleryHeight.value + 1,
);
const creativeSectionStyle = computed(() => ({
  "--creative-reveal-height": revealedGalleryHeight.value
    ? `${revealedGalleryHeight.value}px`
    : "100svh",
  "--creative-stream-height": `${getCreativeCloudHeight(
    creativeCloud.value,
    contentWidth.value / Math.max(viewportHeight.value, 1),
  )}dvh`,
}));

const showMoreCreatives = async () => {
  if (!hasMoreCreatives.value) return;

  revealedGalleryHeight.value = creativeGalleryRef.value.getBoundingClientRect().height * 2;
  await nextTick();
  ScrollTrigger.refresh();
};

const applyLayout = async ({ seed }) => {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error("Invalid creative layout seed");
  }
  if (seed === layoutSeed.value) return;

  layoutSeed.value = seed;
  await nextTick();
  ScrollTrigger.refresh();
};

const shuffleCreatives = async () => {
  if (!import.meta.env.DEV || isSavingLayout.value) return;

  isSavingLayout.value = true;
  saveError.value = "";
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}__creative-layout/shuffle`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to save creative layout");

    await applyLayout(await response.json());
  } catch (error) {
    saveError.value = error.message;
  } finally {
    isSavingLayout.value = false;
  }
};

if (import.meta.hot) {
  import.meta.hot.on("creative-layout:saved", applyLayout);
  onBeforeUnmount(() => import.meta.hot.off("creative-layout:saved", applyLayout));
}
</script>
