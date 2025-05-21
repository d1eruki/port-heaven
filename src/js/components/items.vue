<template>
  <a :href="itemUrl" target="_blank" :class="['item relative flex aspect-video flex-col justify-between rounded-xl', showThumbnail ? '' : 'border']">
    <h4 v-if="!isYoutube" class="z-10 p-4">{{ itemName }}</h4>
    <img v-if="showThumbnail && thumbnailUrl" class="absolute top-0 left-0 h-full w-full object-cover drop-shadow-none" :src="thumbnailUrl" :alt="itemImgAlt" @error="handleImageError" />
    <p v-if="!isYoutube" class="z-10 p-4">{{ itemDesc }}</p>
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
  itemDesc: {
    type: String,
    required: true,
    default: "Default Description",
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

const thumbnailUrl = ref(null);
const isYoutube = ref(false);
const showThumbnail = ref(false);

const handleImageError = () => {
  showThumbnail.value = false;
};

watch(
  () => props.itemUrl,
  async (newUrl) => {
    thumbnailUrl.value = null;
    showThumbnail.value = false;

    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = newUrl.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      thumbnailUrl.value = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      showThumbnail.value = true;
      isYoutube.value = true;
      return;
    } else {
      isYoutube.value = false;
    }

    try {
      const response = await fetch(`http://localhost:3000/meta-image?url=${encodeURIComponent(newUrl)}`);
      const data = await response.json();
      if (data.image) {
        thumbnailUrl.value = data.image;
        showThumbnail.value = true;
      } else {
        thumbnailUrl.value = null;
        showThumbnail.value = false;
      }
    } catch (error) {
      thumbnailUrl.value = null;
      showThumbnail.value = false;
    }
  },
  { immediate: true },
);
</script>
