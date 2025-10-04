<template>
  <a :href="designUrl" target="_blank" class="design active col-span-1 row-span-1 flex h-full flex-col justify-between gap-5 rounded-4xl p-10 lg:min-h-[400px]">
    <h4 class="light:text-[color:var(--white)]">{{ designName }}</h4>
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
