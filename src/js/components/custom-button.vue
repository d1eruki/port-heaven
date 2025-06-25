<template>
  <a class="custom-button flex items-center justify-center px-5 py-5 lg:px-10" :href="url" target="_blank">
    <p>{{ name }}</p>
  </a>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>
