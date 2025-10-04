<template>
  <a :href="designUrl" target="_blank" class="design group active row-span-1 flex h-full flex-col justify-center gap-5 rounded-4xl p-10 hover:items-start hover:justify-between lg:min-h-[400px] lg:items-center">
    <h4 class="light:text-[color:var(--white)]">{{ designName }}</h4>
    <p class="block lg:hidden lg:group-hover:block">{{ designDesc }}</p>
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
