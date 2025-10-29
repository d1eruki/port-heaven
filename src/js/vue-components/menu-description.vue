<template>
  <p class="light:text-grey-500 w-full">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
