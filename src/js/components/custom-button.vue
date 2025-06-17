<template>
  <a class="custom-button light:bg-[var(--black)] light:text-[color:var(--white)] flex justify-center light:hover:bg-[var(--white)] light:hover:text-[color:var(--black)] flex items-center gap-2 lg:px-10 px-5 py-5 text-xl!" :href="url" target="_blank">
    <p>{{ name }}</p>
    <Icons icon="arrow-link" min-height="10" min-width="10" height="10" width="10"></Icons>
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
