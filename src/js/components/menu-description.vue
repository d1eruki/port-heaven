<template>
  <p class="light:text-[color:var(--grey)] w-full !font-[basis33] uppercase">{{ menuDesc }}</p>
</template>

<script setup>
const props = defineProps({
  menuDesc: {
    type: String,
    required: true,
  },
});
</script>
