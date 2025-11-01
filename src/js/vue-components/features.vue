<template>
  <div class="light:border-neutral-900 light:lg:border-neutral-800 relative flex min-h-dvh flex-1 flex-col justify-between p-15 lg:min-h-full lg:gap-10 lg:border-l-1 lg:px-15 lg:py-0">
    <span class="light:text-neutral-900 light:lg:text-neutral-800 absolute -bottom-12 -left-36 z-1 text-[24rem] font-black lg:static lg:text-9xl lg:font-thin">{{ number }}</span>
    <h3 class="light:text-white z-2">{{ title }}</h3>
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
