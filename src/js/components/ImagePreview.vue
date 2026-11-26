<!-- Просмотр изображения с переходом от миниатюры и поддержкой сенсорных жестов. -->
<template>
  <Teleport to="body">
    <dialog
      ref="previewDialog"
      :aria-label="label"
      class="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-x-hidden overflow-y-auto overscroll-none bg-transparent outline-none [-webkit-tap-highlight-color:transparent] backdrop:bg-transparent"
      autofocus
      @cancel.prevent="closePreview"
      @click="handlePreviewTap"
      @close="resetPreview"
      @pointerdown="handlePreviewPointerDown"
      @touchstart.passive="startPreviewTouch"
      @touchmove.stop.passive="movePreviewTouch"
      @touchcancel="ignorePreviewTap = true"
    >
      <div class="relative flex min-h-full flex-col justify-center py-11 lg:items-center lg:py-5">
        <button
          ref="previewBackdrop"
          type="button"
          class="absolute inset-0 bg-(--semantic-surface-contrast) focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-(--semantic-text-on-contrast) lg:bg-transparent"
          :class="{ 'opacity-0': isPreviewPreparing }"
          :aria-label="closeLabel"
        />
        <div
          v-if="image"
          ref="previewFrame"
          data-image-preview-frame
          class="contents lg:relative lg:block lg:shrink-0 lg:origin-center"
        >
          <div
            ref="previewSurface"
            class="contents lg:relative lg:block"
            :class="{ 'lg:pointer-events-none': isClosingPreview }"
          >
            <picture class="contents">
              <source
                v-for="source in image.sources"
                :key="source.type"
                :type="source.type"
                :srcset="source.srcset"
                :sizes="isMobile && !isPreviewFullSize ? thumbnailSizes : '100vw'"
              />
              <img
                ref="previewImage"
                class="relative h-auto w-full shrink-0 origin-top-left lg:max-h-[calc(100dvh-max(26dvh,13rem)-1.25rem)] lg:w-auto lg:max-w-[87vw] lg:object-contain"
                :class="{ invisible: isPreviewPreparing }"
                :src="image.src"
                :alt="image.alt"
                :width="image.width"
                :height="image.height"
              />
            </picture>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { useMediaQuery, useScrollLock } from "@vueuse/core";
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";

const props = defineProps({
  label: { type: String, required: true },
  closeLabel: { type: String, required: true },
  isMobile: { type: Boolean, default: false },
});

const emit = defineEmits(["shown", "closing", "restoring", "closed"]);
const previewDialog = ref(null);
const previewBackdrop = ref(null);
const previewImage = ref(null);
const previewFrame = ref(null);
const previewSurface = ref(null);
const hasFinePointer = useMediaQuery("(pointer: fine)");
const image = shallowRef(null);
const thumbnailSizes = ref("");
const isPreviewPreparing = ref(false);
const isPreviewFullSize = ref(false);
const isClosingPreview = ref(false);
const isPageScrollLocked = useScrollLock(document.documentElement);
const previewMotionTiming = {
  duration: 360,
  easing: "cubic-bezier(0.25, 0.7, 0.25, 1)",
  fill: "both",
};
let previewOrigin = null;
let previewClipContainer = null;
let previewRotation = "0deg";
let previewAnimations = [];
let stopPreviewTilt = null;
let previewTouchStart = null;
let ignorePreviewTap = false;

const clearPreviewAnimations = () => {
  for (const animation of previewAnimations) animation.cancel();
  previewAnimations = [];
};

const enablePreviewTilt = async () => {
  const surface = previewSurface.value;
  if (!surface || props.isMobile || !effectsEnabled.value || !hasFinePointer.value) return;

  try {
    const { initVanillaTilt } = await import("../libraries/vanilla-tilt");
    if (
      surface === previewSurface.value &&
      previewDialog.value?.open &&
      effectsEnabled.value &&
      hasFinePointer.value &&
      !props.isMobile &&
      !isClosingPreview.value &&
      !stopPreviewTilt
    ) {
      stopPreviewTilt = initVanillaTilt([surface]);
    }
  } catch (error) {
    console.error("Failed to initialize preview tilt:", error);
  }
};

const clearPreviewTilt = () => {
  stopPreviewTilt?.();
  stopPreviewTilt = null;
};

const finishPreviewMotion = async (opening) => {
  if (opening) {
    clearPreviewAnimations();
    isPreviewFullSize.value = true;
    void enablePreviewTilt();
    return;
  }

  if (!props.isMobile) {
    // Reveal the thumbnail while the preview still covers its final frame.
    emit("restoring");
    await nextTick();
  }
  previewDialog.value?.close();
};

const getThumbnailClipPath = (thumbnail, fullSize) => {
  if (!props.isMobile || !previewClipContainer?.isConnected) return null;

  const clip = previewClipContainer.getBoundingClientRect();
  const radius =
    Number.parseFloat(getComputedStyle(previewClipContainer).borderBottomLeftRadius) || 0;
  if (
    thumbnail.left >= clip.left &&
    thumbnail.right <= clip.right &&
    thumbnail.top >= clip.top + radius &&
    thumbnail.bottom <= clip.bottom - radius
  ) {
    return null;
  }

  // Express the gallery's clip in the image's coordinates at thumbnail scale.
  const scaleX = fullSize.width / thumbnail.width;
  const scaleY = fullSize.height / thumbnail.height;
  const top = (clip.top - thumbnail.top) * scaleY;
  const right = (thumbnail.right - clip.right) * scaleX;
  const bottom = (thumbnail.bottom - clip.bottom) * scaleY;
  const left = (clip.left - thumbnail.left) * scaleX;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius * scaleX}px / ${radius * scaleY}px)`;
};

const animatePreview = (opening) => {
  const frame = props.isMobile ? previewImage.value : previewFrame.value;
  const backdrop = previewBackdrop.value;
  if (!effectsEnabled.value || !frame || !previewOrigin?.isConnected) {
    finishPreviewMotion(opening);
    return;
  }

  // Read the current frame before cancelling so a quick dismissal continues from it.
  const { transform: currentTransform, clipPath: currentClipPath } = getComputedStyle(frame);
  const currentOpacity = getComputedStyle(backdrop).opacity;
  clearPreviewAnimations();

  const thumbnail = previewOrigin.getBoundingClientRect();
  // The frame's own box stays flat even while the inner surface is tilted.
  const fullSize = frame.getBoundingClientRect();
  if (!thumbnail.width || !thumbnail.height || !fullSize.width || !fullSize.height) {
    finishPreviewMotion(opening);
    return;
  }

  const x = thumbnail.x - fullSize.x;
  const y = thumbnail.y - fullSize.y;
  const thumbnailTransform = props.isMobile
    ? `translate(${x}px, ${y}px) scale(${thumbnail.width / fullSize.width}, ${thumbnail.height / fullSize.height})`
    : `translate(${x + (thumbnail.width - fullSize.width) / 2}px, ${y + (thumbnail.height - fullSize.height) / 2}px) rotate(${previewRotation}) scale(${previewOrigin.offsetWidth / fullSize.width}, ${previewOrigin.offsetHeight / fullSize.height})`;
  const timing = props.isMobile ? previewMotionTiming : { ...previewMotionTiming, duration: 500 };
  const imageKeyframes = {
    transform: opening ? [thumbnailTransform, "none"] : [currentTransform, thumbnailTransform],
  };
  const thumbnailClipPath = getThumbnailClipPath(thumbnail, fullSize);
  if (thumbnailClipPath) {
    const fullClipPath = "inset(0px 0px 0px 0px round 0px / 0px)";
    imageKeyframes.clipPath = opening
      ? [thumbnailClipPath, fullClipPath]
      : [currentClipPath === "none" ? fullClipPath : currentClipPath, thumbnailClipPath];
  }
  const imageAnimation = frame.animate(imageKeyframes, timing);
  const backdropAnimation = backdrop.animate(
    { opacity: opening ? [0, 1] : [currentOpacity, 0] },
    timing,
  );
  previewAnimations = [imageAnimation, backdropAnimation];

  if (!opening && stopPreviewTilt) {
    const surface = previewSurface.value;
    const glare = surface.querySelector(".js-tilt-glare-inner");
    const surfaceTransform = getComputedStyle(surface).transform;
    previewAnimations.push(surface.animate({ transform: [surfaceTransform, "none"] }, timing));
    if (glare) {
      const { transform, opacity } = getComputedStyle(glare);
      previewAnimations.push(
        glare.animate({ transform: [transform, transform], opacity: [opacity, 0] }, timing),
      );
    }
  }

  imageAnimation.onfinish = () => {
    if (previewAnimations[0] === imageAnimation) finishPreviewMotion(opening);
  };
};

const open = async (source, origin, sizes, { rotation = "0deg", clipContainer } = {}) => {
  if (image.value) return;

  previewOrigin = origin;
  previewClipContainer = clipContainer;
  previewRotation = rotation;
  thumbnailSizes.value = sizes;
  isClosingPreview.value = false;
  isPreviewPreparing.value = effectsEnabled.value;
  isPreviewFullSize.value = !isPreviewPreparing.value;
  image.value = source;
  previewDialog.value.showModal();
  previewDialog.value.scrollTop = 0;
  isPageScrollLocked.value = true;
  if (!isPreviewPreparing.value) {
    emit("shown", source);
    return;
  }

  await nextTick();
  const preview = previewImage.value;
  const decoded = await preview?.decode().then(
    () => true,
    () => false,
  );
  if (!previewDialog.value?.open || previewImage.value !== preview || isClosingPreview.value)
    return;

  if (decoded) animatePreview(true);
  else void finishPreviewMotion(true);
  isPreviewPreparing.value = false;
  emit("shown", source);
};

const closePreview = () => {
  if (!previewDialog.value.open || isClosingPreview.value) return;

  isClosingPreview.value = true;
  emit("closing");
  if (isPreviewPreparing.value) previewDialog.value.close();
  else animatePreview(false);
};

const handlePreviewPointerDown = (event) => {
  if (event.pointerType !== "touch") ignorePreviewTap = false;
};

const startPreviewTouch = ({ touches }) => {
  ignorePreviewTap = touches.length > 1;
  previewTouchStart = touches[0];
};

// Stop touchmove from reaching the page scroll lock while allowing Safari to zoom and pan.
const movePreviewTouch = ({ touches }) => {
  const touch = touches[0];
  if (
    touches.length > 1 ||
    (touch &&
      previewTouchStart &&
      Math.hypot(
        touch.clientX - previewTouchStart.clientX,
        touch.clientY - previewTouchStart.clientY,
      ) > 8)
  ) {
    ignorePreviewTap = true;
  }
};

const handlePreviewTap = (event) => {
  if (!ignorePreviewTap || event.detail === 0) closePreview();
};

const resetPreview = () => {
  if (previewDialog.value.open) return;

  clearPreviewAnimations();
  clearPreviewTilt();
  isPageScrollLocked.value = false;
  previewOrigin = null;
  previewClipContainer = null;
  previewTouchStart = null;
  ignorePreviewTap = false;
  isPreviewPreparing.value = false;
  image.value = null;
  emit("closed");
};

watch(
  () => props.isMobile,
  () => {
    if (previewDialog.value?.open) previewDialog.value.close();
  },
);

watch(effectsEnabled, (enabled) => {
  if (enabled) return;

  clearPreviewTilt();
  if (previewAnimations.length) void finishPreviewMotion(!isClosingPreview.value);
});

watch(hasFinePointer, (hasPointer) => {
  if (!hasPointer) clearPreviewTilt();
});

onBeforeUnmount(() => {
  clearPreviewAnimations();
  clearPreviewTilt();
  isPageScrollLocked.value = false;
});

defineExpose({ open });
</script>
