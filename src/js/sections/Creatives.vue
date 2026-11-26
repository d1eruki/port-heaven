<!-- Креативы с сохраняемой раскладкой, раскрытием галереи и просмотром картинок на мобильных экранах. -->
<template>
  <section
    ref="creativeSectionRef"
    data-section="creatives"
    id="creatives"
    class="relative min-h-svh max-lg:flex max-lg:flex-col max-lg:gap-content max-lg:px-section max-lg:pt-section-gap lg:h-(--creative-stream-height)"
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
            class="lg:justify-self-center lg:text-center lg:contain-[inline-size]"
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
      class="w-full overflow-clip max-lg:max-h-(--creative-reveal-height) max-lg:rounded-4xl lg:absolute lg:inset-0 lg:block"
    >
      <div
        ref="creativeGalleryContentRef"
        class="w-full columns-2 gap-0 sm:columns-3 lg:contents"
      >
        <div
          v-for="creative in creativeCloud"
          :key="creative.src"
          :data-creative-cloud-item="creative.id"
          :data-depth="creative.depth"
          :data-drift-x="creative.driftX"
          :data-drift-y="creative.driftY"
          class="relative block w-full break-inside-avoid hover:z-100! lg:absolute lg:top-(--creative-top) lg:left-(--creative-left) lg:z-(--creative-z-index) lg:w-(--creative-width) lg:rotate-(--creative-rotation) lg:will-change-transform"
          :class="{
            'lg:opacity-0': creative.id === visiblePreviewId,
            'lg:invisible':
              previewOffsets &&
              creative.id !== visiblePreviewId &&
              !previewOffsets.has(creative.id),
          }"
          :style="creative.style"
        >
          <div
            class="contents lg:block lg:translate-x-[var(--creative-scatter-x,0px)] lg:translate-y-[var(--creative-scatter-y,0px)]"
            :class="
              effectsEnabled &&
              'lg:transition-[translate] lg:duration-500 lg:ease-[cubic-bezier(0.25,0.7,0.25,1)]'
            "
            :style="previewOffsets?.get(creative.id)"
          >
            <VideoCreative
              v-if="creative.type === 'video'"
              :creative-src="creative.src"
            />
            <ImageCreative
              v-else
              class="focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary max-lg:[-webkit-tap-highlight-color:transparent]"
              :creative-alt="creative.alt"
              :creative-src="creative.src"
              :image-sources="creative.sources"
              :image-sizes="getGalleryImageSizes(creative)"
              :image-height="creative.height"
              :image-width="creative.width"
              :preview-label="
                isMobileGallery ? t('buttons.openCreative', { image: creative.alt }) : creative.alt
              "
              @preview="(event, image) => openPreview(creative, event, image)"
            />
          </div>
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
    <ImagePreview
      ref="imagePreview"
      :label="t('menu.creatives.preview')"
      :close-label="t('buttons.close')"
      :is-mobile="isMobileGallery"
      @shown="showPreview"
      @closing="restorePreviewLayout"
      @restoring="visiblePreviewId = null"
      @closed="resetPreview"
    />
  </section>
</template>

<script setup>
import { useElementSize, useMediaQuery, useWindowSize } from "@vueuse/core";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import Button from "../components/Button.vue";
import { createCreatives } from "../data/creatives";
import savedLayout from "../data/creative-layout.json";
import ImageCreative from "../components/ImageCreative.vue";
import ImagePreview from "../components/ImagePreview.vue";
import MenuDescription from "../components/MenuDescription.vue";
import VideoCreative from "../components/VideoCreative.vue";
import { devModeEnabled } from "../features/preferences/dev-mode";
import { effectsEnabled } from "../features/preferences/effects-toggle";
import { ScrollTrigger } from "../libraries/gsap-scroll";
import { createCreativeCloudItem, getCreativeCloudHeight } from "../utils/creative-cloud-layout";
import { getBreakpointPx } from "../utils/breakpoints";

const { t } = useI18n();
const creativeSectionRef = ref(null);
const { width: contentWidth } = useElementSize(creativeSectionRef);
const { width: viewportWidth, height: viewportHeight } = useWindowSize();
const contentMaxWidth = getBreakpointPx("3xl");
const isMobileGallery = useMediaQuery(`(width < ${getBreakpointPx("lg")}px)`);
const imagePreview = ref(null);
const visiblePreviewId = ref(null);
const previewOffsets = shallowRef(null);
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

const getGalleryImageSizes = (creative) =>
  `(min-width: 1024px) min(${creative.layoutWidth}vw, ${(creative.layoutWidth / 100) * contentMaxWidth}px), (min-width: 640px) calc((100vw - 5rem) / 3), calc((100vw - 5rem) / 2)`;

const spreadPreviewNeighbours = (selectedId) => {
  if (isMobileGallery.value) return;

  const offsets = new Map();
  if (!effectsEnabled.value) {
    previewOffsets.value = offsets;
    return;
  }

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  // Allow the scroll position to finish settling after the dialog takes focus.
  const margin = height * 0.2;
  for (const item of creativeGalleryRef.value.querySelectorAll("[data-creative-cloud-item]")) {
    const id = item.dataset.creativeCloudItem;
    if (id === selectedId) continue;

    const { left, right, top, bottom } = item.getBoundingClientRect();
    if (right <= 0 || left >= width || bottom <= 0 || top >= height) continue;

    const direction = Math.atan2(
      (top + bottom) / (2 * height) - 0.5,
      (left + right) / (2 * width) - 0.5,
    );
    const x = Math.cos(direction);
    const y = Math.sin(direction);
    const horizontalTravel = ((x < 0 ? right : width - left) + margin) / Math.abs(x);
    const verticalTravel = ((y < 0 ? bottom : height - top) + margin) / Math.abs(y);
    const travel = Math.min(horizontalTravel, verticalTravel);

    // Convert viewport movement into the rotated card's local coordinates.
    const angle =
      (Number.parseFloat(item.style.getPropertyValue("--creative-rotation")) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    offsets.set(id, {
      "--creative-scatter-x": `${(x * cos + y * sin) * travel}px`,
      "--creative-scatter-y": `${(y * cos - x * sin) * travel}px`,
    });
  }
  previewOffsets.value = offsets;
};

watch([viewportWidth, viewportHeight], () => {
  if (previewOffsets.value) spreadPreviewNeighbours(visiblePreviewId.value);
});

const openPreview = (creative, event, image) => {
  const trigger = event.currentTarget;
  if (event.detail === 0) trigger.focus({ preventScroll: true });
  const origin = isMobileGallery.value ? trigger : image;
  void imagePreview.value.open(creative, origin, getGalleryImageSizes(creative), {
    rotation: creative.style["--creative-rotation"],
    clipContainer: isMobileGallery.value ? creativeGalleryRef.value : null,
  });
};

const showPreview = (creative) => {
  visiblePreviewId.value = creative.id;
  spreadPreviewNeighbours(creative.id);
};

const restorePreviewLayout = () => {
  previewOffsets.value = null;
};

const resetPreview = () => {
  restorePreviewLayout();
  visiblePreviewId.value = null;
};

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
