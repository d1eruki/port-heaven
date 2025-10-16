<template>
  <p class="light:text-(--color-grey) lg:max-w-150 w-full">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
