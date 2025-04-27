<template>
  <img class="h-[52px] w-[52px] rounded-xl drop-shadow-none" :src="itemImage" alt="" />
</template>

<script setup>
const props = defineProps({
  itemImage: {
    type: String,
    required: true,
  },
});
</script>
