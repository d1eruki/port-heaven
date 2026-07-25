<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="anim-extrude active flex rounded-full bg-accent px-5 py-2.5 text-on-accent lg:px-10 lg:py-5"
    :class="mobileFullWidth ? 'w-full justify-center text-center lg:w-fit' : 'w-fit'"
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
  mobileFullWidth: {
    type: Boolean,
    default: false,
  },
});
</script>
