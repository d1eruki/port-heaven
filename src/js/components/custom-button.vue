<template>
  <a class="custom-button flex items-center justify-center gap-2 px-5 py-5 text-xl! lg:px-10" :href="url" target="_blank">
    <p>{{ name }}</p>
    <Icons icon="arrow-link" min-height="10" min-width="10" height="10" width="10"></Icons>
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
