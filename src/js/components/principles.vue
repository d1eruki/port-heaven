<template>
  <div class="light:bg-[var(--black)] flex flex-col justify-between gap-10 p-5">
    <div class="flex flex-col gap-2 md:gap-10">
      <span class="biryani light:text-[color:var(--grey-dark)] text-9xl">{{ number }}</span>
      <h3 class="light:text-[color:var(--white)]">{{ title }}</h3>
    </div>
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
