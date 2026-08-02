<template>
  <div
    class="vanilla-tilt-creatives group h-fit overflow-hidden rounded-4xl hover:z-100"
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
import { useIntersectionObserver } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";
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

const syncEffectsMode = () => {
  const video = videoEl.value;
  if (!video || !isSourceLoaded.value) return;

  if (effectsEnabled.value) video.play().catch(() => {});
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

const { isSupported, stop } = useIntersectionObserver(
  videoEl,
  (entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;

    loadVideo();
    stop();
  },
  {
    rootMargin: "300px 0px",
    threshold: 0.01,
  },
);

watch(effectsEnabled, syncEffectsMode);

onMounted(() => {
  if (!isSupported.value) loadVideo();
  else syncEffectsMode();
});
</script>
