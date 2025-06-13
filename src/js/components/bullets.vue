<template>
  <div class="flex items-center">
    <svg viewBox="-150 -150 300 300" style="width: 30px; height: 30px">
      <polygon class="star" points=""></polygon>
    </svg>
    <p>
      {{ text }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
    default: "default text",
  },
});
</script>
