<!-- Креативы с сохраняемой раскладкой, раскрытием галереи и просмотром картинок на мобильных экранах. -->
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
            class="max-lg:[-webkit-tap-highlight-color:transparent] max-lg:focus:outline-none max-lg:focus-visible:outline-2 max-lg:focus-visible:-outline-offset-2 max-lg:focus-visible:outline-primary"
            :creative-alt="creative.alt"
            :creative-src="creative.src"
            :image-sources="creative.sources"
            :image-sizes="getGalleryImageSizes(creative)"
            :image-height="creative.height"
            :image-width="creative.width"
            :preview-label="
              isMobileGallery ? t('buttons.openCreative', { image: creative.alt }) : ''
            "
            @preview="openPreview(creative, $event)"
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
    <Teleport to="body">
      <dialog
        ref="previewDialog"
        :aria-label="t('menu.creatives.preview')"
        class="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-x-hidden overflow-y-auto overscroll-none bg-transparent outline-none backdrop:bg-transparent"
        autofocus
        @cancel.prevent="closePreview"
        @close="resetPreview"
      >
        <div class="relative flex min-h-full flex-col justify-center py-11">
          <button
            ref="previewBackdrop"
            type="button"
            class="absolute inset-0 bg-(--semantic-surface-contrast) [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-(--semantic-text-on-contrast)"
            :class="{ 'opacity-0': isPreviewPreparing }"
            :aria-label="t('buttons.close')"
            @click="closePreview"
          />
          <picture
            v-if="previewCreative"
            class="contents"
          >
            <source
              v-for="source in previewCreative.sources"
              :key="source.type"
              :type="source.type"
              :srcset="source.srcset"
              :sizes="isPreviewFullSize ? '100vw' : getGalleryImageSizes(previewCreative)"
            />
            <img
              ref="previewImage"
              class="relative h-auto w-full shrink-0 origin-top-left"
              :class="{ invisible: isPreviewPreparing }"
              :src="previewCreative.src"
              :alt="previewCreative.alt"
              :width="previewCreative.width"
              :height="previewCreative.height"
            />
          </picture>
        </div>
      </dialog>
    </Teleport>
  </section>
</template>

<script setup>
import { useElementSize, useMediaQuery, useScrollLock, useWindowSize } from "@vueuse/core";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import Button from "../components/Button.vue";
import { createCreatives } from "../data/creatives";
import savedLayout from "../data/creative-layout.json";
import ImageCreative from "../components/ImageCreative.vue";
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
const { height: viewportHeight } = useWindowSize();
const contentMaxWidth = getBreakpointPx("3xl");
const isMobileGallery = useMediaQuery(`(width < ${getBreakpointPx("lg")}px)`);
const previewDialog = ref(null);
const previewBackdrop = ref(null);
const previewImage = ref(null);
const previewCreative = shallowRef(null);
const isPreviewPreparing = ref(false);
const isPreviewFullSize = ref(false);
const isPageScrollLocked = useScrollLock(document.documentElement);
const previewMotionTiming = {
  duration: 360,
  easing: "cubic-bezier(0.25, 0.7, 0.25, 1)",
  fill: "both",
};
let previewOrigin = null;
let previewAnimations = [];
let isClosingPreview = false;
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

const clearPreviewAnimations = () => {
  for (const animation of previewAnimations) animation.cancel();
  previewAnimations = [];
};

const finishPreviewMotion = (opening) => {
  if (opening) {
    clearPreviewAnimations();
    isPreviewFullSize.value = true;
  } else {
    previewDialog.value.close();
  }
};

const animatePreview = (opening) => {
  const image = previewImage.value;
  const backdrop = previewBackdrop.value;
  if (!effectsEnabled.value || !image || !previewOrigin?.isConnected) {
    finishPreviewMotion(opening);
    return;
  }

  // Read the current frame before cancelling so a quick dismissal continues from it.
  const currentTransform = getComputedStyle(image).transform;
  const currentOpacity = getComputedStyle(backdrop).opacity;
  clearPreviewAnimations();

  const thumbnail = previewOrigin.getBoundingClientRect();
  const fullSize = image.getBoundingClientRect();
  if (!thumbnail.width || !thumbnail.height || !fullSize.width || !fullSize.height) {
    finishPreviewMotion(opening);
    return;
  }

  const thumbnailTransform = `translate(${thumbnail.x - fullSize.x}px, ${thumbnail.y - fullSize.y}px) scale(${thumbnail.width / fullSize.width}, ${thumbnail.height / fullSize.height})`;
  const imageAnimation = image.animate(
    {
      transform: opening ? [thumbnailTransform, "none"] : [currentTransform, thumbnailTransform],
    },
    previewMotionTiming,
  );
  const backdropAnimation = backdrop.animate(
    { opacity: opening ? [0, 1] : [currentOpacity, 0] },
    previewMotionTiming,
  );
  previewAnimations = [imageAnimation, backdropAnimation];
  imageAnimation.onfinish = () => {
    if (previewAnimations[0] === imageAnimation) finishPreviewMotion(opening);
  };
};

const openPreview = async (creative, event) => {
  if (!isMobileGallery.value || previewCreative.value) return;

  const origin = event.currentTarget;
  if (event.detail === 0) origin.focus({ preventScroll: true });
  previewOrigin = origin;
  isClosingPreview = false;
  isPreviewPreparing.value = effectsEnabled.value;
  isPreviewFullSize.value = !isPreviewPreparing.value;
  previewCreative.value = creative;
  previewDialog.value.showModal();
  previewDialog.value.scrollTop = 0;
  isPageScrollLocked.value = true;
  if (!isPreviewPreparing.value) return;

  await nextTick();
  const image = previewImage.value;
  const decoded = await image?.decode().then(
    () => true,
    () => false,
  );
  if (!previewDialog.value?.open || previewImage.value !== image || isClosingPreview) return;

  if (decoded) animatePreview(true);
  else isPreviewFullSize.value = true;
  isPreviewPreparing.value = false;
};

const closePreview = () => {
  if (!previewDialog.value.open || isClosingPreview) return;

  isClosingPreview = true;
  if (isPreviewPreparing.value) previewDialog.value.close();
  else animatePreview(false);
};

const resetPreview = () => {
  if (previewDialog.value.open) return;

  clearPreviewAnimations();
  isPageScrollLocked.value = false;
  previewOrigin = null;
  isPreviewPreparing.value = false;
  previewCreative.value = null;
};

watch(isMobileGallery, (isMobile) => {
  if (!isMobile && previewDialog.value?.open) previewDialog.value.close();
});

watch(effectsEnabled, (enabled) => {
  if (!enabled && previewAnimations.length) finishPreviewMotion(!isClosingPreview);
});

onBeforeUnmount(clearPreviewAnimations);

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
