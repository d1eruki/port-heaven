<template>
  <a :href="itemUrl" target="_blank" class="item relative flex aspect-video flex-col rounded-xl">
    <h4 class="z-10 p-4">{{ itemName }}</h4>
    <img class="absolute top-0 left-0 h-full w-full rounded-xl object-cover drop-shadow-none grayscale hover:grayscale-0" :src="thumbnailUrl" :alt="itemImgAlt" />
  </a>
</template>

<script setup>
import { ref, watch } from "vue";

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

const thumbnailUrl = ref("");

watch(
  () => props.itemUrl,
  async (newUrl) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = newUrl.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      thumbnailUrl.value = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/meta-image?url=${encodeURIComponent(newUrl)}`);
      const data = await response.json();
      thumbnailUrl.value = data.image || "";
    } catch (error) {
      thumbnailUrl.value = "";
    }
  },
  { immediate: true },
);
</script>
