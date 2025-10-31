<template>
  <div class="light:border-neutral-800 flex flex-1 flex-col gap-10 border-l-1 px-10 dark:border-neutral-200">
    <span class="light:text-neutral-800 text-9xl">{{ number }}</span>
    <h3 class="light:text-white">{{ title }}</h3>
    <p>{{ text }}</p>
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
