<template>
  <a :href="designUrl" target="_blank" class="design active col-span-1 row-span-1 flex h-full flex-col rounded-4xl justify-between gap-5 p-5 lg:min-h-[400px]">
    <h3>{{ designName }}</h3>
    <p>{{ designDesc }}</p>
  </a>
</template>

<script setup>
const props = defineProps({
  designUrl: {
    type: String,
    required: true,
  },
  designName: {
    type: String,
    required: true,
  },
  designDesc: {
    type: String,
    required: true,
  },
});
</script>
