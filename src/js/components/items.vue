<template>
  <a :href="itemUrl" target="_blank" class="item flex aspect-video flex-col justify-between outline">
    <h4 class="p-4">{{ itemName }}</h4>
    <p class="p-4">{{ itemDesc }}</p>
  </a>
</template>

<script setup>
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
});
</script>
