<template>
  <a :href="itemUrl" target="_blank" class="item col-span-1 row-span-1 flex h-full flex-col justify-between gap-5 p-5">
    <h4>{{ itemName }}</h4>
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
