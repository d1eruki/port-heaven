<template>
  <img class="card aspect-video object-cover" :src="creativeSrc" :style="{ gridArea: creativeGridArea }" alt="post-card" />
</template>

<script setup>
const props = defineProps({
  creativeSrc: {
    type: String,
    required: true,
  },
  creativeGridArea: {
    type: String,
    required: false,
    default: 'auto',
  },
});
</script>
