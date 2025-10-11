<template>
  <p class="light:text-(--color-grey) w-full">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
