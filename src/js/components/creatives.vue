<template>
  <div class="card h-fit" :style="{ gridArea: creativeGridArea }">
    <img class="aspect-video object-cover" :src="creativeSrc" alt="post-card" />
  </div>
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
    default: "auto",
  },
});
</script>
