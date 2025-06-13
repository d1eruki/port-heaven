<template>
  <a class="custom-button px-10 py-2 light:bg-[var(--black)] light:text-[color:var(--white)] light:hover:bg-[var(--yellow)] light:hover:text-[color:var(--black)]" :href="url" target="_blank">{{ name }}</a>
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
