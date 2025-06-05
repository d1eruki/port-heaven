<template>
  <div class="inline-block w-0.5 self-stretch bg-(--grey-dark)"></div>
  <div class="flex flex-1 flex-col gap-2 lg:gap-10">
    <span class="biryani numbers !text-[var(--grey-dark)]">{{ number }}</span>
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
