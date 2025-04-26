<template>
  <a :href="youtubeUrl" target="_blank" class="item flex flex-col rounded-xl aspect-video relative">
    <h4 class="z-5 p-4 hidden">{{ itemName }}</h4>
    <img class="rounded-xl drop-shadow-none absolute grayscale hover:grayscale-0" :src="thumbnailUrl" :alt="itemImgAlt" />
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemName: {
    type: String,
    required: true,
    default: 'Default Title',
  },
  youtubeUrl: {
    type: String,
    required: true,
    default: 'https://www.youtube.com/',
  },
  itemImgAlt: {
    type: String,
    required: true,
    default: 'YouTube Video Thumbnail',
  },
});

const thumbnailUrl = computed(() => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = props.youtubeUrl.match(regex);
  const videoId = match ? match[1] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'assets/images/default.svg';
});
</script>
