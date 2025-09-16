<template>
  <a :href="itemUrl" target="_blank" class="item active col-span-1 row-span-1 flex h-full flex-col justify-between gap-5 p-5">
    <h3>{{ itemName }}</h3>
    <p>{{ itemDesc }}</p>
  </a>
</template>

<script setup>
const props = defineProps({
  itemName: {
    type: String,
    required: true,
  },
  itemDesc: {
    type: String,
    required: true,
  },
  itemUrl: {
    type: String,
    required: true,
  },
});
</script>
