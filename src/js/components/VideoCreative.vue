<template>
  <div
    class="vanilla-tilt-creatives group h-fit hover:z-100"
    :style="computedStyle"
  >
    <video
      ref="videoEl"
      class="aspect-video w-full transition-all duration-1000 ease-in-out lg:grayscale lg:group-hover:grayscale-0"
      :src="isSourceLoaded ? creativeSrc : undefined"
      muted
      controls
      :autoplay="effectsEnabled"
      :loop="effectsEnabled"
      preload="auto"
      playsinline
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { getCreativeGridStyle } from "../utils/creative-grid-style";

const props = defineProps({
  creativeSrc: { type: String, required: true },
  row: { type: [Number, String], required: true, default: 1 },
  rowSpan: { type: Number, default: 1 },
  col: { type: [Number, String], required: true, default: 1 },
  colSpan: { type: Number, default: 1 },
});

const computedStyle = computed(() => getCreativeGridStyle(props));

const videoEl = ref(null);
const isSourceLoaded = ref(false);
const effectsEnabled = ref(false);
let observer = null;
let effectsObserver = null;

const syncEffectsMode = () => {
  const enabled = document.documentElement.classList.contains("effects");
  effectsEnabled.value = enabled;

  const video = videoEl.value;
  if (!video || !isSourceLoaded.value) return;

  if (enabled) video.play().catch(() => {});
  else video.pause();
};

const loadVideo = async () => {
  if (isSourceLoaded.value) return;

  isSourceLoaded.value = true;
  await nextTick();

  const video = videoEl.value;
  if (!video) return;

  video.load();
  if (effectsEnabled.value) video.play().catch(() => {});
};

onMounted(() => {
  effectsObserver = new MutationObserver(syncEffectsMode);
  effectsObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  syncEffectsMode();

  if (!("IntersectionObserver" in window)) {
    loadVideo();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      loadVideo();
      observer?.disconnect();
      observer = null;
    },
    {
      rootMargin: "300px 0px",
      threshold: 0.01,
    },
  );

  if (videoEl.value) observer.observe(videoEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  effectsObserver?.disconnect();
});
</script>
