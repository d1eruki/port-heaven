<template>
  <div class="light:border-neutral-900 light:lg:border-neutral-800 relative grid min-h-dvh flex-1 xl:auto-rows-[1fr] justify-between p-15 lg:min-h-full lg:gap-10 lg:border-l-1 lg:px-15 lg:py-0">
    <small class="light:text-white z-2">/ {{ title }}</small>
    <span class="light:text-neutral-700 light:lg:text-neutral-700 z-1 text-[8rem] font-black lg:static lg:text-9xl lg:font-bold">{{ number }}</span>
    <p class="z-2">{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  number: {
    type: String,
    required: true,
    default: "00",
  },
  title: {
    type: String,
    required: true,
    default: "default title",
  },
  text: {
    type: String,
    required: true,
    default: "default text",
  },
});
</script>
