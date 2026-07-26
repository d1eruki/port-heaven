<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="anim-extrude active flex w-full justify-center rounded-full bg-accent px-5 py-5 text-center text-on-accent lg:w-fit lg:px-10"
  >
    <span class="font-heading"><slot /></span>
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    required: true,
  },
});
</script>
