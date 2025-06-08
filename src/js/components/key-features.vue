<template>
  <div class="light:border-neutral-200 flex flex-1 flex-col gap-2 border-l-1 p-10 lg:gap-10 dark:border-neutral-800">
    <span class="biryani numbers light:text-neutral-200 dark:text-neutral-800">{{ number }}</span>
    <h3>{{ title }}</h3>
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
