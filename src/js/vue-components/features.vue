<template>
  <div class="light:border-neutral-800 relative z-2 grid min-h-fit flex-1 justify-between gap-15 p-15 lg:min-h-full lg:gap-20 lg:border-l-1 lg:p-15 xl:[grid-template-rows:auto_1fr_auto]">
    <small class="light:text-white">{{ title }}</small>
    <span class="light:text-primary text-[8rem] font-black lg:static lg:text-9xl lg:font-bold">{{ number }}</span>
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  number: {
    type: String,
  },
  title: {
    type: String,
  },
  text: {
    type: String,
    required: true,
    default: "default text",
  },
});
</script>
