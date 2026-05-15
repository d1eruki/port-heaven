<template>
  <p class="w-full dark:text-neutral-500">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
