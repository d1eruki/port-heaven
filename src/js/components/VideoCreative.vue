<template>
  <div class="vanilla-tilt-creatives group h-fit overflow-hidden hover:z-100">
    <video
      ref="videoEl"
      class="aspect-video w-full transition-all duration-1000 ease-in-out"
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
import { nextTick, onMounted, ref, watch } from "vue";
import { effectsEnabled } from "../features/preferences/effects-toggle";

defineProps({
  creativeSrc: { type: String, required: true },
});

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
