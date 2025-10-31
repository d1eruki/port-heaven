<template>
  <p class="light:text-neutral-500 w-full">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
