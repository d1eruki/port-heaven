<!-- Креативы с общей сохраняемой раскладкой и локальной кнопкой перетасовки. -->
<template>
  <section
    ref="creativeSectionRef"
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh max-lg:flex max-lg:flex-col max-lg:gap-10 max-lg:p-10 lg:h-[var(--creative-stream-height)]"
    :style="creativeSectionStyle"
  >
    <div
      data-creatives-heading-pin
      class="contents lg:pointer-events-none lg:relative lg:z-20 lg:grid lg:h-dvh lg:w-full lg:place-items-center"
    >
      <div
        class="pointer-events-none left-0 flex w-auto flex-col gap-5 rounded-4xl bg-inverse p-5 text-on-inverse lg:w-fit lg:items-center lg:rounded-none lg:bg-transparent lg:p-0 lg:text-primary"
      >
        <div class="grid w-fit max-w-full self-center gap-5">
          <h2>{{ t("menu.creatives.title") }}</h2>
          <MenuDescription
            class="justify-self-center text-center [contain:inline-size]"
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
      data-creative-cloud
      aria-label="Creative work gallery"
      class="w-full columns-2 gap-3 sm:columns-3 sm:gap-5 lg:absolute lg:inset-0 lg:block lg:columns-auto lg:overflow-clip"
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
          :image-sources="creative.sources"
          :image-sizes="`(min-width: 1024px) min(${creative.layoutWidth}vw, ${creative.layoutWidth / 100 * contentMaxWidth}px), (min-width: 640px) calc((100vw - 7.5rem) / 3), calc((100vw - 5.75rem) / 2)`"
          :image-height="creative.height"
          :image-width="creative.width"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useElementSize, useWindowSize } from "@vueuse/core";
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
const layoutSeed = ref(savedLayout.seed);
const isSavingLayout = ref(false);
const saveError = ref("");
const creativeCloud = computed(() =>
  createCreatives(layoutSeed.value).map((creative, index) =>
    createCreativeCloudItem(creative, index, layoutSeed.value),
  ),
);
const creativeSectionStyle = computed(() => ({
  "--creative-stream-height": `${getCreativeCloudHeight(
    creativeCloud.value,
    contentWidth.value / Math.max(viewportHeight.value, 1),
  )}dvh`,
}));

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
