<template>
  <a :href="itemUrl" target="_blank" class="item relative flex aspect-video flex-col rounded-xl">
    <h4 class="z-10 p-4">{{ itemName }}</h4>
    <img class="absolute top-0 left-0 h-full w-full rounded-xl object-cover drop-shadow-none grayscale hover:grayscale-0" :src="thumbnailUrl" :alt="itemImgAlt" />
  </a>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  itemName: {
    type: String,
    required: true,
    default: "Default Title",
  },
  itemUrl: {
    type: String,
    required: true,
    default: "https://www.youtube.com/",
  },
  itemImgAlt: {
    type: String,
    required: false,
    default: "",
  },
});

const thumbnailUrl = computed(() => {
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = props.itemUrl.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  const figmaRegex = /figma\.com\/(?:file|design)\/([a-zA-Z0-9_-]{22})/;
  const figmaMatch = props.itemUrl.match(figmaRegex);
});
</script>
