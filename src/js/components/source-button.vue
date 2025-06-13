<template>
  <a class="custom-button px-10 py-2" :href="url" target="_blank">{{ name }}</a>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
    default: "https://www.google.com/",
  },
  name: {
    type: String,
    required: true,
    default: "https://www.google.com/",
  },
});
</script>
