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
      @play="onPlaybackEvent"
      @pause="onPlaybackEvent"
      playsinline
    />
  </div>
</template>

<script setup>
import { useDocumentVisibility, useIntersectionObserver } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";
import {
  canAutoplayVideo,
  createVideoPlaybackState,
  transitionVideoPlayback,
} from "../features/media/video-playback";

defineProps({
  creativeSrc: { type: String, required: true },
});

const videoEl = ref(null);
const isSourceLoaded = ref(false);
const isInViewport = ref(false);
const isSourceReady = ref(false);
const visibility = useDocumentVisibility();
const playbackState = shallowRef(createVideoPlaybackState());
const readEnvironment = () => ({
  effectsEnabled: effectsEnabled.value,
  ready: isSourceReady.value,
  inViewport: isInViewport.value,
  elementVisible: isInViewport.value,
  pageVisible: visibility.value === "visible",
  paused: videoEl.value?.paused ?? true,
  ended: videoEl.value?.ended ?? false,
});
const shouldAutoplay = computed(() => canAutoplayVideo(playbackState.value, readEnvironment()));

const dispatchPlayback = (event, currentVisibility = {}) => {
  const video = videoEl.value;
  if (!video) return;
  const result = transitionVideoPlayback(playbackState.value, event, {
    ...readEnvironment(),
    ...currentVisibility,
  });
  playbackState.value = result.state;
  if (result.action === "play") video.play().catch(() => {});
  else if (result.action === "pause") video.pause();
};

const onPlaybackEvent = (event) => {
  const video = videoEl.value;
  if (!video) return;
  // Media events may precede the visibility observer's next callback.
  const bounds = video.getBoundingClientRect();
  dispatchPlayback(event.type, {
    pageVisible: document.visibilityState === "visible",
    elementVisible:
      bounds.width > 0 &&
      bounds.height > 0 &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      bounds.right > 0 &&
      bounds.left < window.innerWidth,
  });
};

const syncPlayback = () => dispatchPlayback("environment");

const loadVideo = async () => {
  if (isSourceLoaded.value) return;
  isSourceLoaded.value = true;
  await nextTick();
  videoEl.value?.load();
  isSourceReady.value = true;
  syncPlayback();
};

// Loading may start near the viewport; playback requires actual visibility.
const { isSupported, stop } = useIntersectionObserver(
  videoEl,
  (entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    void loadVideo();
    stop();
  },
  { rootMargin: "300px 0px", threshold: 0.01 },
);

useIntersectionObserver(
  videoEl,
  ([entry]) => {
    isInViewport.value = entry?.isIntersecting ?? false;
  },
  { threshold: 0.01 },
);

watch([effectsEnabled, isSourceReady, isInViewport, visibility], syncPlayback);

onMounted(() => {
  if (!isSupported.value) {
    isInViewport.value = true;
    void loadVideo();
  }
});
</script>
