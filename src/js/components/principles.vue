<template>
  <div class="light:bg-[var(--black)] light:lg:border-[color:var(--grey)] flex flex-col justify-between gap-10 border-r p-5">
    <div class="flex flex-col gap-10">
      <span class="biryani numbers light:text-[color:var(--white)]">{{ number }}</span>
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
  },
  text: {
    type: String,
    required: true,
  },
});
</script>
