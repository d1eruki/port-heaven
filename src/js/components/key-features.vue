<template>
  <div class="inline-block w-0.5 self-stretch bg-(--grey-light)"></div>
  <div class="flex flex-1 flex-col gap-2 lg:gap-10">
    <span class="biryani numbers !text-[var(--grey-light)]">{{ number }}</span>
    <div>
      <svg viewBox="-150 -150 300 300" style="width: 30px; height: 30px">
        <polygon class="star" points=""></polygon>
      </svg>
      <h3>{{ title }}</h3>
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
