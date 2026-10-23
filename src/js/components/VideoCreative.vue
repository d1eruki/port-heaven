<!-- Видео с отложенной загрузкой, видимым автозапуском и сохранением ручного управления. -->
<template>
  <div class="vanilla-tilt-creatives group h-fit overflow-hidden hover:z-100">
    <video
      ref="videoEl"
      class="aspect-video w-full transition-all duration-1000 ease-in-out"
      :src="isSourceLoaded ? creativeSrc : undefined"
      muted
      controls
      :autoplay="shouldAutoplay"
      :loop="effectsEnabled"
      preload="auto"
      @play="onPlay"
      @pause="onPause"
      playsinline
    />
  </div>
</template>

<script setup>
import { useDocumentVisibility, useIntersectionObserver } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";

defineProps({
  creativeSrc: { type: String, required: true },
});

const videoEl = ref(null);
const isSourceLoaded = ref(false);
const isInViewport = ref(false);
const isSourceReady = ref(false);
const visibility = useDocumentVisibility();
const playbackIntent = ref("auto");
let expectedPlay = false;
let expectedPause = false;

const shouldAutoplay = computed(() =>
  effectsEnabled.value && isSourceReady.value && isInViewport.value &&
  visibility.value === "visible" && playbackIntent.value === "auto",
);

const onPlay = () => {
  if (expectedPlay) expectedPlay = false;
  else if (!shouldAutoplay.value) playbackIntent.value = "playing";
};

const onPause = () => {
  if (expectedPause) expectedPause = false;
  else if (!videoEl.value?.ended) playbackIntent.value = "paused";
};

const syncPlayback = () => {
  const video = videoEl.value;
  if (!video || !isSourceReady.value || playbackIntent.value === "playing") return;

  if (shouldAutoplay.value && video.paused) {
    expectedPlay = true;
    video.play().catch(() => { expectedPlay = false; });
  } else if (!shouldAutoplay.value && !video.paused) {
    expectedPause = true;
    video.pause();
  }
};

const loadVideo = async () => {
  if (isSourceLoaded.value) return;
  isSourceLoaded.value = true;
  await nextTick();
  videoEl.value?.load();
  isSourceReady.value = true;
  syncPlayback();
};

// Loading may start near the viewport; playback requires actual visibility.
const { isSupported, stop } = useIntersectionObserver(videoEl, (entries) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  void loadVideo();
  stop();
}, { rootMargin: "300px 0px", threshold: 0.01 });

useIntersectionObserver(videoEl, ([entry]) => {
  isInViewport.value = entry?.isIntersecting ?? false;
}, { threshold: 0.01 });

watch([shouldAutoplay, playbackIntent], syncPlayback);

onMounted(() => {
  if (!isSupported.value) {
    isInViewport.value = true;
    void loadVideo();
  }
});
</script>
