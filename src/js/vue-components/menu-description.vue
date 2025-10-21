<template>
  <p class="light:text-(--color-grey) w-full lg:max-w-150">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
