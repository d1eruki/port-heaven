<template>
  <div class="light:border-neutral-800 flex flex-1 flex-col gap-2 border-l-1 px-10 gap-10 dark:border-neutral-200">
    <span class="biryani light:text-neutral-800 text-9xl dark:text-neutral-200">{{ number }}</span>
    <h3 class="light:text-[color:var(--white)]">{{ title }}</h3>
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
