<template>
  <a class="custom-button light:bg-[var(--black)] light:text-[color:var(--white)] light:hover:bg-[var(--blue)] light:hover:text-[color:var(--black)] flex items-center gap-2 px-5 py-2 text-xl!" :href="url" target="_blank">
    <p>{{ name }}</p>
    <Icons class="light:fill-[var(--grey)]" icon="arrow-link" min-height="10" min-width="10" height="10" width="10"></Icons>
  </a>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
    default: "https://www.google.com/",
  },
  name: {
    type: String,
    required: true,
    default: "https://www.google.com/",
  },
});
</script>
