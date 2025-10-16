<template>
  <p class="light:text-(--color-grey) lg:w-150">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
